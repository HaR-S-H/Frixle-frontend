import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, VideoIcon, X, Loader2, Camera, Smile, Pencil } from 'lucide-react';
import { postData } from '@/context/PostContext';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const EditCommentDialog = ({ comment, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState(comment.text || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {editComment } = postData();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    

    

    try {
        //    await updatePost(comment._id, formData);
        const text = caption;
       await editComment(comment._id,text);
      setOpen(false);
      if (onEdit) onEdit();
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={(e) => e.preventDefault()}>
          <Pencil className="h-4 w-4" />
          <span>Edit Comment</span>
        </DropdownMenuItem>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg w-[95%] p-4 sm:p-6 mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Comment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Media Display/Upload Area */}

            {/* Caption Input */}
            <div className="relative">
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-24 pr-12 resize-none"
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
              >
                <Smile className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentDialog;