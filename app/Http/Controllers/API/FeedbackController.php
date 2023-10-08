<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\UserFeedback;
use App\Models\Comment;
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
        dd($feedback->upvotes());
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
        $user = Auth::user();
        $feedback = Feedback::findOrFail($id);


        $user_voted = UserFeedback::where('user_id',$user->id)->first();
        if($user_voted)
        {
            return response()->json(['message' => 'You have already vote this feedback.']);
        }
        $user_vote = new UserFeedback();
        $user_vote->user_id = $user->id;
        $user_vote->feedback_id  = $feedback->id;
        $user_vote->vote_type  =  'upvote';
        $user_vote->save();

        return response()->json(['message' => 'Upvoted successfully.']);
    }

    public function downvote($id)
    {
        $user = Auth::user();
        $feedback = Feedback::findOrFail($id);


        $user_voted = UserFeedback::where('user_id',$user->id)->first();
        if($user_voted)
        {
            return response()->json(['message' => 'You have already vote this feedback.']);
        }
        $user_vote = new UserFeedback();
        $user_vote->user_id = $user->id;
        $user_vote->feedback_id  = $feedback->id;
        $user_vote->vote_type  =  'downvote';
        $user_vote->save();

        return response()->json(['message' => 'downvote successfully.']);
    }

    public function comment(Request $request,$id)
    {
        $user = Auth::user();
        $feedback = Feedback::findOrFail($id);

        $user_comment = new Comment();
        $user_comment->user_id = $user->id;
        $user_comment->feedback_id  = $feedback->id;
        $user_comment->content = $request->content;
        $user_comment->save();

        return response()->json(['message' => 'Comment successfully.']);
    }

}
