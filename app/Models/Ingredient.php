<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = ['restaurant_id', 'name', 'unit', 'photo'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_ingredients')
                    ->withPivot('quantity_required')
                    ->withTimestamps();
    }
}
