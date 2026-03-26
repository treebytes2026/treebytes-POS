<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventory';
    protected $fillable = ['ingredient_id', 'quantity', 'reorder_level'];

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}
