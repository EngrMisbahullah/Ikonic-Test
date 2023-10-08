<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (User::count() <= 0) {
            User::create([
                'first_name' => 'Admin',
                'last_name' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => bcrypt('password'),
                'role_id' => 1,
                'enabled' => true,
            ]);
            User::create([
                'first_name' => 'User',
                'last_name' => 'User',
                'email' => 'user@admin.com',
                'password' => bcrypt('password'),
                'role_id' => 2,
                'enabled' => true,
            ]);
        }
    }
}
