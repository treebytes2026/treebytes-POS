<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Restaurant;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Super Admin goes to Platform Admin
        if ($user->role === 'super_admin') {
            return redirect()->route('admin.dashboard');
        }

        // 2. Restaurant Owner/Staff goes to Restaurant Dashboard
        if ($user->restaurant_id) {
            return redirect()->route('restaurant.dashboard');
        }

        // 3. Fallback for testing: Auto-assign first restaurant if exists
        $firstRestaurant = Restaurant::first();
        if ($firstRestaurant) {
            $user->update(['restaurant_id' => $firstRestaurant->id]);
            return redirect()->route('restaurant.dashboard');
        }

        abort(403, 'Unauthorized access: No restaurant assigned to your account.');
    }
}
