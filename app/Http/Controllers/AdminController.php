<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Restaurant;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::with('subscriptions')->latest()->get()->map(function ($rest) {
            $latestSub = $rest->subscriptions->last();
            return [
                'id' => $rest->id,
                'name' => $rest->name,
                'owner' => $rest->owner_name,
                'email' => $rest->email,
                'address' => $rest->address,
                'status' => $rest->status,
                'logo' => $rest->logo ? Storage::url($rest->logo) : null,
                'plan' => $latestSub ? ucfirst($latestSub->plan_type) : 'None',
                'expires' => $latestSub ? $latestSub->end_date->format('Y-m-d') : 'N/A'
            ];
        });

        return Inertia::render('Admin/Restaurants', [
            'restaurants' => $restaurants,
        ]);
    }

    public function users()
    {
        return Inertia::render('Admin/Users', [
            'all_users' => User::latest()->get()
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role'  => 'required|in:user,super_admin',
        ]);

        $user->update($validated);

        return back();
    }

    public function destroyUser(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return back();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'email' => 'required|email|unique:restaurants',
            'password' => 'required|string|min:8',
            'address' => 'nullable|string',
            'status' => 'required|string|in:active,trial,expired',
            'plan_type' => 'required|in:trial,monthly,yearly',
            'logo' => 'nullable|image|max:1024',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Provision a User account for the restaurant owner
        User::create([
            'name' => $validated['owner_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user', 
        ]);

        $restaurant = Restaurant::create([
            'name' => $validated['name'],
            'owner_name' => $validated['owner_name'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'status' => $validated['status'],
            'logo' => $logoPath,
        ]);

        // Create subscription
        $endDate = Carbon::now();
        if ($validated['plan_type'] === 'trial') $endDate->addDays(14);
        elseif ($validated['plan_type'] === 'monthly') $endDate->addMonth();
        elseif ($validated['plan_type'] === 'yearly') $endDate->addYear();

        $restaurant->subscriptions()->create([
            'plan_type' => $validated['plan_type'],
            'start_date' => Carbon::now(),
            'end_date' => $endDate,
            'status' => $validated['status'],
        ]);

        return back();
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'email' => 'required|email|unique:restaurants,email,' . $restaurant->id,
            'password' => 'nullable|string|min:8',
            'address' => 'nullable|string',
            'status' => 'required|string|in:active,trial,expired',
        ]);

        if ($request->hasFile('logo')) {
            if ($restaurant->logo) {
                Storage::disk('public')->delete($restaurant->logo);
            }
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $restaurant->update($validated);

        $user = User::where('email', $restaurant->getOriginal('email'))->first();
        if ($user) {
            $userProps = [
                'name' => $validated['owner_name'],
                'email' => $validated['email'],
            ];
            if (!empty($validated['password'])) {
                $userProps['password'] = Hash::make($validated['password']);
            }
            $user->update($userProps);
        }

        return back();
    }

    public function destroy(Restaurant $restaurant)
    {
        if ($restaurant->logo) {
            Storage::disk('public')->delete($restaurant->logo);
        }

        // Cascade delete the associated Owner user account
        User::where('email', $restaurant->email)->delete();

        $restaurant->delete();
        
        return back();
    }
}
