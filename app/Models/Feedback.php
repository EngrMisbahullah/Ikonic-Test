<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function upvotes()
    {
        return $this->belongsToMany(User::class, 'feedback_upvotes', 'feedback_id', 'user_id');
    }

    // Define the relationship with users who downvoted
    public function downvotes()
    {
        return $this->belongsToMany(User::class, 'feedback_downvotes', 'feedback_id', 'user_id');
    }

    // Define the relationship with comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Define a method to check if the user has already upvoted
    public function hasUpvotedByUser($userId)
    {
        return $this->upvotes->contains($userId);
    }

    // Define a method to check if the user has already downvoted
    public function hasDownvotedByUser($userId)
    {
        return $this->downvotes->contains($userId);
    }

    // Define a method to increment the vote count
    public function incrementVoteCount()
    {
        $this->increment('vote_count');
    }

    // Define a method to decrement the vote count
    public function decrementVoteCount()
    {
        $this->decrement('vote_count');
    }
}
