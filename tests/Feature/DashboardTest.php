<?php

use App\Models\User;
use App\Models\Restaurant;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $restaurant = Restaurant::create([
        'name' => 'Test Resto',
        'owner_name' => 'Owner',
        'email' => 'test@resto.com',
    ]);
    
    $user = User::factory()->create(['restaurant_id' => $restaurant->id]);
    $this->actingAs($user);

    $this->get('/dashboard')->assertRedirect(route('restaurant.dashboard'));
});