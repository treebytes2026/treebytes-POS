<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

use App\Http\Controllers\AdminController;

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $activeSubs = \App\Models\Subscription::where('status', 'active')->count();
        $expiredAccounts = \App\Models\Subscription::where('status', 'expired')->count();
        $stats = [
            [ 'title' => 'Total Sales', 'value' => '$0.00', 'icon' => 'CreditCard', 'color' => 'text-emerald-500', 'bg' => 'bg-emerald-500/10' ],
            [ 'title' => 'Total Users', 'value' => (string)\App\Models\User::count(), 'icon' => 'Users', 'color' => 'text-blue-500', 'bg' => 'bg-blue-500/10' ],
            [ 'title' => 'Active Subscriptions', 'value' => (string)$activeSubs, 'icon' => 'Store', 'color' => 'text-indigo-500', 'bg' => 'bg-indigo-500/10' ],
            [ 'title' => 'Expired Accounts', 'value' => (string)$expiredAccounts, 'icon' => 'AlertCircle', 'color' => 'text-rose-500', 'bg' => 'bg-rose-500/10' ],
        ];
        return Inertia::render('dashboard', [ 'stats' => $stats ]);
    })->name('dashboard');

    Route::get('admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('admin/restaurants', [AdminController::class, 'store'])->name('admin.restaurants.store');
    Route::post('admin/restaurants/{restaurant}', [AdminController::class, 'update'])->name('admin.restaurants.update'); // using POST for update if Inertia form with files, or use method spoofing
    Route::delete('admin/restaurants/{restaurant}', [AdminController::class, 'destroy'])->name('admin.restaurants.destroy');

    Route::get('admin/users', [AdminController::class, 'users'])->name('admin.users.index');
    Route::put('admin/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('admin/users/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
