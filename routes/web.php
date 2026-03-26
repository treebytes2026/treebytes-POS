<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

use App\Http\Controllers\AdminController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\DashboardController;

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('admin/restaurants', [AdminController::class, 'store'])->name('admin.restaurants.store');
    Route::post('admin/restaurants/{restaurant}', [AdminController::class, 'update'])->name('admin.restaurants.update'); // using POST for update if Inertia form with files, or use method spoofing
    Route::delete('admin/restaurants/{restaurant}', [AdminController::class, 'destroy'])->name('admin.restaurants.destroy');

    Route::get('admin/users', [AdminController::class, 'users'])->name('admin.users.index');
    Route::put('admin/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('admin/users/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');

    // Restaurant Owner / Staff Routes
    Route::get('/restaurant/dashboard', [RestaurantController::class, 'index'])->name('restaurant.dashboard');
    Route::get('/restaurant/pos', [RestaurantController::class, 'pos'])->name('restaurant.pos');
    Route::post('/restaurant/process-order', [RestaurantController::class, 'processOrder'])->name('restaurant.process-order');
    Route::get('/restaurant/categories', [RestaurantController::class, 'categories'])->name('restaurant.categories');
    Route::post('/restaurant/categories', [RestaurantController::class, 'storeCategory'])->name('restaurant.categories.store');
    Route::put('/restaurant/categories/{category}', [RestaurantController::class, 'updateCategory'])->name('restaurant.categories.update');
    Route::delete('/restaurant/categories/{category}', [RestaurantController::class, 'destroyCategory'])->name('restaurant.categories.destroy');

    Route::get('/restaurant/products', [RestaurantController::class, 'products'])->name('restaurant.products');
    Route::post('/restaurant/products', [RestaurantController::class, 'storeProduct'])->name('restaurant.products.store');
    Route::post('/restaurant/products/{product}', [RestaurantController::class, 'updateProduct'])->name('restaurant.products.update'); // using POST for file upload support in Inertia
    Route::post('/restaurant/products/{product}/recipe', [RestaurantController::class, 'updateRecipe'])->name('restaurant.products.recipe');
    Route::get('/restaurant/orders', [RestaurantController::class, 'orders'])->name('restaurant.orders.index');
    Route::patch('/restaurant/orders/{order}/status', [RestaurantController::class, 'updateOrderStatus'])->name('restaurant.orders.status');

    Route::get('/restaurant/inventory', [RestaurantController::class, 'inventory'])->name('restaurant.inventory');
    Route::post('/restaurant/ingredients', [RestaurantController::class, 'storeIngredient'])->name('restaurant.ingredients.store');
    Route::put('/restaurant/ingredients/{ingredient}', [RestaurantController::class, 'updateIngredient'])->name('restaurant.ingredients.update');
    Route::delete('/restaurant/ingredients/{ingredient}', [RestaurantController::class, 'destroyIngredient'])->name('restaurant.ingredients.destroy');
    Route::get('/restaurant/staff', [RestaurantController::class, 'staff'])->name('restaurant.staff');
    Route::post('/restaurant/staff', [RestaurantController::class, 'storeStaff'])->name('restaurant.staff.store');
    Route::post('/restaurant/staff/{staff}', [RestaurantController::class, 'updateStaff'])->name('restaurant.staff.update');
    Route::delete('/restaurant/staff/{staff}', [RestaurantController::class, 'destroyStaff'])->name('restaurant.staff.destroy');

    Route::get('/restaurant/settings', [RestaurantController::class, 'settings'])->name('restaurant.settings');
    Route::post('/restaurant/settings', [RestaurantController::class, 'updateSettings'])->name('restaurant.settings.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
