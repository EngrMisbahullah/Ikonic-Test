<?php

use App\Http\Controllers\API\FeedbackController;
use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/auth/register', [AuthController::class, 'createUser']);
Route::post('/auth/login', [AuthController::class, 'loginUser']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});




    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/feedback',[FeedbackController::class,'index'])->name('feedback');
        Route::post('/feedback/create', [FeedbackController::class,'store'])->name('feedback.insert');
        Route::get('/feedback/{id}', [FeedbackController::class,'show'])->name('feedback.show');
        Route::put('/feedback/{id}', [FeedbackController::class,'update'])->name('feedback.update');
        Route::delete('/feedback/{id}', [FeedbackController::class,'destroy'])->name('feedback.destroy');

        // Voting routes
        Route::post('/feedback/{id}/upvote', [FeedbackController::class,'upvote']);
        Route::post('/feedback/{id}/downvote', [FeedbackController::class,'downvote']);

        // Comment routes
        Route::post('/feedback/{id}/comments', [FeedbackController::class,'store']);
        Route::get('/feedback/{id}/comments', [FeedbackController::class,'index']);
    });
