<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffProfile extends Model
{
    protected $fillable = [
        'user_id', 'photo', 'phone', 'address', 'position', 
        'birth_date', 'hire_date', 'emergency_contact_name', 
        'emergency_contact_phone'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
