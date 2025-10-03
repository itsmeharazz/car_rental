<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //storeManager
    public function storeManager(Request $request)
    {
        $auth = $request->user();
        if(!$auth || $auth->role !== 'admin'){
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
        ]);

        // Compute provided password
        $password = 'password123'; // Default password for new managers
        $manager = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($password),
            'role' => 'manager',
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Manager created successfully',
             'manager' => $manager->only (['id', 'name', 'email', 'role']), 
            'default_password' => $password],
             201);
    }

    //indexManagers
    public function indexManagers (Request $request)
    {
        $auth = $request->user();
        if (!$auth || $auth->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $managers = User::where('role', 'manager')->select('id', 'name', 'email', 'created_at')->paginate(5);
        return response()->json($managers);
    }

    //destroyManager
    public function destroyManager(Request $request, $id)
    {
        $auth = $request->user();
        if (!$auth || $auth->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $manager = User::where('id', $id)->where('role', 'manager')->first();

        if (!$manager) {
            return response()->json(['message' => 'Manager not found!'], 404);
        }

        $manager->delete();
        return response()->json(['message' => 'Manager Deleted!']);
    }
}
