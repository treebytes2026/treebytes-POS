<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\Ingredient;
use Illuminate\Support\Facades\Auth;

class RestaurantController extends Controller
{
    public function orders()
    {
        $restaurant = Auth::user()->restaurant;
        if (!$restaurant) return redirect()->route('dashboard');

        return Inertia::render('Restaurant/Orders', [
            'orders' => $restaurant->orders()->with(['items.product', 'user'])->latest()->get()
        ]);
    }

    /* Restaurant Branding & Settings */
    public function settings()
    {
        return Inertia::render('Restaurant/Settings', [
            'restaurant' => Auth::user()->restaurant
        ]);
    }

    public function updateSettings(Request $request)
    {
        $restaurant = Auth::user()->restaurant;
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'email' => 'required|email|unique:restaurants,email,' . $restaurant->id,
            'address' => 'nullable|string',
            'logo' => 'nullable|image|max:1024',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'owner_name' => $validated['owner_name'],
            'email' => $validated['email'],
            'address' => $validated['address'],
        ];

        if ($request->hasFile('logo')) {
            if ($restaurant->logo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($restaurant->logo);
            }
            $updateData['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $restaurant->update($updateData);

        return back()->with('success', 'Restaurant settings updated!');
    }

    public function updateOrderStatus(Request $request, \App\Models\Order $order)
    {
        $this->authorizeOwner($order);
        $request->validate(['status' => 'required|in:pending,completed,cancelled']);
        
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Order status updated to ' . $request->status);
    }

    public function index()
    {
        $user = Auth::user();
        if (!$user->restaurant_id) {
            abort(403, 'Unauthorized access: No restaurant assigned.');
        }

        $restaurant = $user->restaurant;
        
        // Basic dashboard stats
        $stats = [
            'total_sales' => $restaurant->orders()->sum('total_amount'),
            'total_orders' => $restaurant->orders()->count(),
            'total_products' => $restaurant->products()->count(),
            'low_stock_count' => 0, // Placeholder
        ];

        return Inertia::render('Restaurant/Dashboard', [
            'restaurant' => $restaurant,
            'stats' => $stats
        ]);
    }

    public function pos(Request $request)
    {
        $restaurantId = Auth::user()->restaurant_id;
        
        $categories = Category::where('restaurant_id', $restaurantId)->get();
        $products = Product::where('restaurant_id', $restaurantId)
            ->where('status', 'active')
            ->get();

        return Inertia::render('Restaurant/POS', [
            'categories' => $categories,
            'products' => $products,
            'restaurant' => Auth::user()->restaurant,
            'initialTable' => $request->query('table'),
        ]);
    }

    /* Menu Management */
    public function categories()
    {
        $restaurant = Auth::user()->restaurant;
        if (!$restaurant) return redirect()->route('dashboard');

        return Inertia::render('Restaurant/Categories', [
            'categories' => $restaurant->categories()->withCount('products')->latest()->get()
        ]);
    }

    public function products()
    {
        $restaurant = Auth::user()->restaurant;
        if (!$restaurant) return redirect()->route('dashboard');

        return Inertia::render('Restaurant/Products', [
            'products' => $restaurant->products()->with(['category', 'ingredients'])->latest()->get(),
            'categories' => $restaurant->categories()->get(),
            'ingredients' => $restaurant->ingredients()->get()
        ]);
    }

    public function updateRecipe(Request $request, Product $product)
    {
        $this->authorizeOwner($product);
        $validated = $request->validate([
            'ingredients' => 'array',
            'ingredients.*.id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
        ]);

        $syncData = [];
        foreach ($validated['ingredients'] as $item) {
            $syncData[$item['id']] = ['quantity_required' => $item['quantity']];
        }

        $product->ingredients()->sync($syncData);

        return back()->with('success', 'Recipe updated!');
    }

    /* Inventory Management */
    public function inventory()
    {
        $restaurant = Auth::user()->restaurant;
        if (!$restaurant) return redirect()->route('dashboard');

        return Inertia::render('Restaurant/Inventory', [
            'ingredients' => $restaurant->ingredients()->with('inventory')->latest()->get()
        ]);
    }

    public function storeIngredient(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'quantity' => 'required|numeric|min:0',
            'reorder_level' => 'required|numeric|min:0',
            'photo' => 'nullable|image|max:1024',
        ]);

        $restaurant = Auth::user()->restaurant;
        
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('ingredients', 'public');
        }

        $ingredient = $restaurant->ingredients()->create([
            'name' => $validated['name'],
            'unit' => $validated['unit'],
            'photo' => $photoPath,
        ]);

        $ingredient->inventory()->create([
            'quantity' => $validated['quantity'],
            'reorder_level' => $validated['reorder_level'],
        ]);

        return back()->with('success', 'Ingredient added to inventory!');
    }

    public function updateIngredient(Request $request, \App\Models\Ingredient $ingredient)
    {
        $this->authorizeOwner($ingredient);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'quantity' => 'required|numeric|min:0',
            'reorder_level' => 'required|numeric|min:0',
            'photo' => 'nullable|image|max:1024',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'unit' => $validated['unit'],
        ];

        if ($request->hasFile('photo')) {
            if ($ingredient->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($ingredient->photo);
            }
            $updateData['photo'] = $request->file('photo')->store('ingredients', 'public');
        }

        $ingredient->update($updateData);

        $ingredient->inventory()->updateOrCreate(
            ['ingredient_id' => $ingredient->id],
            [
                'quantity' => $validated['quantity'],
                'reorder_level' => $validated['reorder_level']
            ]
        );

        return back()->with('success', 'Ingredient updated!');
    }

    public function destroyIngredient(\App\Models\Ingredient $ingredient)
    {
        $this->authorizeOwner($ingredient);
        $ingredient->delete();
        return back()->with('success', 'Ingredient removed from inventory!');
    }

    /* Staff Management */
    public function staff()
    {
        $restaurant = Auth::user()->restaurant;
        if (!$restaurant) return redirect()->route('dashboard');

        return Inertia::render('Restaurant/Staff', [
            'staff' => $restaurant->users()->with('staffProfile')->where('role', 'user')->latest()->get()
        ]);
    }

    public function storeStaff(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'position' => 'required|string',
            'photo' => 'nullable|image|max:1024',
        ]);

        $user = Auth::user()->restaurant->users()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => 'user',
            'restaurant_id' => Auth::user()->restaurant_id,
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('staff', 'public');
        }

        $user->staffProfile()->create([
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'position' => $validated['position'],
            'photo' => $photoPath,
        ]);

        return back()->with('success', 'Staff member added!');
    }

    public function updateStaff(Request $request, \App\Models\User $staff)
    {
        $this->authorizeOwner($staff);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $staff->id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'position' => 'required|string',
            'photo' => 'nullable|image|max:1024',
        ]);

        $staff->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $profileData = [
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'position' => $validated['position'],
        ];

        if ($request->hasFile('photo')) {
            if ($staff->staffProfile && $staff->staffProfile->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($staff->staffProfile->photo);
            }
            $profileData['photo'] = $request->file('photo')->store('staff', 'public');
        }

        $staff->staffProfile()->updateOrCreate(['user_id' => $staff->id], $profileData);

        return back()->with('success', 'Staff updated!');
    }

    public function destroyStaff(\App\Models\User $staff)
    {
        $this->authorizeOwner($staff);
        if ($staff->id === Auth::id()) abort(403);
        
        if ($staff->staffProfile && $staff->staffProfile->photo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($staff->staffProfile->photo);
        }
        
        $staff->delete();
        return back()->with('success', 'Staff deleted!');
    }

    /* Category Actions */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        Auth::user()->restaurant->categories()->create($validated);
        return back()->with('success', 'Category created!');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $this->authorizeOwner($category);
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $category->update($validated);
        return back()->with('success', 'Category updated!');
    }

    public function destroyCategory(Category $category)
    {
        $this->authorizeOwner($category);
        $category->delete();
        return back()->with('success', 'Category deleted!');
    }

    /* Product Actions */
    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|max:1024',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        Auth::user()->restaurant->products()->create($validated);
        return back()->with('success', 'Product added!');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $this->authorizeOwner($product);
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|max:1024',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);
        return back()->with('success', 'Product updated!');
    }

    public function destroyProduct(Product $product)
    {
        $this->authorizeOwner($product);
        if ($product->image) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return back()->with('success', 'Product deleted!');
    }

    /* POS Actions */
    public function processOrder(Request $request)
    {
        $validated = $request->validate([
            'cart' => 'required|array',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'order_type' => 'required|in:dine_in,take_out,delivery',
            'table_number' => 'nullable|string',
            'payment_method' => 'required|in:cash,card,gcash,maya',
            'notes' => 'nullable|string',
        ]);

        $restaurant = Auth::user()->restaurant;
        
        // Find existing pending order for this table if applicable
        $order = null;
        if ($validated['order_type'] === 'dine_in' && !empty($validated['table_number'])) {
            $order = $restaurant->orders()
                ->where('table_number', $validated['table_number'])
                ->where('status', 'pending')
                ->latest()
                ->first();
        }

        $isNewOrder = !$order;
        if ($isNewOrder) {
            $order = $restaurant->orders()->create([
                'user_id' => Auth::id(),
                'table_number' => $validated['table_number'],
                'total_amount' => 0, 
                'order_type' => $validated['order_type'],
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'],
                'status' => 'pending',
            ]);
        } else {
            // Update order notes if new ones provided
            if (!empty($validated['notes'])) {
                $order->update(['notes' => ($order->notes ? $order->notes . " | " : "") . $validated['notes']]);
            }
        }

        $totalAddedAmount = 0;
        $addedItemsForPrinting = [];
        foreach ($validated['cart'] as $cartItem) {
            $product = Product::with('ingredients.inventory')->find($cartItem['id']);
            if (!$product) continue;

            $price = $product->price;
            $quantity = $cartItem['quantity'];
            $subtotal = $price * $quantity;
            $totalAddedAmount += $subtotal;

            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'unit_price' => $price,
                'subtotal' => $subtotal,
            ]);

            $addedItemsForPrinting[] = [
                'name' => $product->name,
                'quantity' => $quantity,
            ];

            // Deduct Inventory
            foreach ($product->ingredients as $ingredient) {
                $requiredVal = $ingredient->pivot->quantity_required * $quantity;
                if ($ingredient->inventory) {
                    $ingredient->inventory->decrement('quantity', $requiredVal);
                }
            }
        }

        $order->update(['total_amount' => $order->total_amount + $totalAddedAmount]);

        // Flash items for the printer to catch
        session()->flash('kitchen_slip', [
            'order_id' => $order->id,
            'table_number' => $order->table_number,
            'items' => $addedItemsForPrinting,
            'date' => now()->format('Y-m-d H:i:s'),
            'type' => $order->order_type,
            'is_new' => $isNewOrder
        ]);

        return back()->with('success', $isNewOrder ? 'Order processed!' : 'Items added to Table ' . $order->table_number);
    }

    private function authorizeOwner($model)
    {
        if ($model->restaurant_id !== Auth::user()->restaurant_id) {
            abort(403, 'Unauthorized.');
        }
    }
}
