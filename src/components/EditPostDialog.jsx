import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, VideoIcon, X, Loader2, Camera, Smile, Pencil } from 'lucide-react';
import { postData } from '@/context/PostContext';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const EditPostDialog = ({ post, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState(post?.text || '');
  const [mediaFiles, setMediaFiles] = useState([]); // Store actual files
  const [mediaUrls, setMediaUrls] = useState(post?.media || []); // Store preview URLs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { updatePost } = postData();

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files (optional)
    const invalidFiles = files.filter(file => !file.type.match(/^(image|video)\//));
    if (invalidFiles.length > 0) {
      setError('Please upload only images or videos');
      return;
    }

    // Create preview URLs for display
    const newMediaUrls = files.map(file => URL.createObjectURL(file));
    
    // Store both files and their preview URLs
    setMediaFiles(prev => [...prev, ...files]);
    setMediaUrls(prev => [...prev, ...newMediaUrls]);
    setError('');
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaUrls(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('text', caption);
      
      // Append each file to FormData
      mediaFiles.forEach((file, index) => {
        formData.append('media', file);
      });

      // If you need to keep existing media URLs that weren't changed
      if (post?.media) {
        formData.append('existingMedia', JSON.stringify(post.media));
      }

      await updatePost(post._id, formData);
      setOpen(false);
      if (onEdit) onEdit();
      
      // Clean up URLs
      mediaUrls.forEach(url => URL.revokeObjectURL(url));
    } catch (error) {
      console.error('Failed to update post:', error);
      setError(error.message || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up URLs when dialog closes
  const handleDialogClose = () => {
    if (!open) {
      mediaUrls.forEach(url => URL.revokeObjectURL(url));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} onClose={handleDialogClose}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={(e) => e.preventDefault()}>
          <Pencil className="h-4 w-4" />
          <span>Edit Post</span>
        </DropdownMenuItem>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg w-[95%] p-4 sm:p-6 mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div className="space-y-4">
            {/* Media Display/Upload Area */}
            <div className="space-y-4">
              {mediaUrls.length === 0 ? (
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-4">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <VideoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-gray-500">
                      <p className="font-semibold">Add Photos or Videos</p>
                      <p className="text-sm">Share your moments</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {mediaUrls.length < 10 && (
                    <div
                      className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleMediaChange}
              />
            </div>

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

export default EditPostDialog;