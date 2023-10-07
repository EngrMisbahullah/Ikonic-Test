<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Feedback\FeedbackCollection;
use App\Http\Resources\Feedback\FeedbackResource;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::query();

        // Sorting
        if ($request->has('sort')) {
            $sortField = $request->input('sort');
            $query->orderBy($sortField);
        }

        // Categorizing
        if ($request->has('category')) {
            $category = $request->input('category');
            $query->where('category', $category);
        }

        $feedback = $query->paginate(10);
        $data = array(
            'feedback' => FeedbackResource::collection($feedback)
        );
        return $this->response(true, $data, 'Feedback Data .....');
    }


    public function store(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(),
            [
                'title' => 'required',
                'contents' => 'required',
                'category' => 'required'
            ]);

            if($validateUser->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            $user = Auth::user();
            $feedback = new Feedback();
            $feedback->title = $request->title;
            $feedback->description = $request->contents;
            $feedback->category = $request->category;
            $feedback->user_id = $user->id;
            $feedback->save();
            $data = array(
                'feedback' => $feedback
            );
            return  $this->response(true, $data,'User Login Successfully');

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function upvote($id)
    {
        $feedback = Feedback::findOrFail($id);

        // Check if the user has already upvoted
        if ($feedback->hasUpvotedByUser(auth()->user()->id)) {
            return response()->json(['message' => 'You have already upvoted this feedback.'], 400);
        }

        // Upvote the feedback
        $feedback->upvotes()->attach(auth()->user()->id);

        // Update the vote count
        $feedback->increment('vote_count');

        return response()->json(['message' => 'Upvoted successfully.']);
    }

    public function downvote($id)
    {
        $feedback = Feedback::findOrFail($id);

        // Check if the user has already downvoted
        if ($feedback->hasDownvotedByUser(auth()->user()->id)) {
            return response()->json(['message' => 'You have already downvoted this feedback.'], 400);
        }

        // Downvote the feedback
        $feedback->downvotes()->attach(auth()->user()->id);

        // Update the vote count
        $feedback->decrement('vote_count');

        return response()->json(['message' => 'Downvoted successfully.']);
    }

}
