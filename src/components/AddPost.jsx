import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, VideoIcon, X, Loader2, Camera, Smile } from 'lucide-react';
import { postData } from '@/context/PostContext';
import MainLayout from '@/layout/MainLayout';

const AddPost = () => {
  const [caption, setCaption] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { addPost } = postData();
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    setMediaFiles(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    const formdata = new FormData();
    formdata.append('text', caption);
    mediaFiles.forEach(file => formdata.append('media', file.file));
    addPost(formdata);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // setShowSuccess(true);
    setIsSubmitting(false);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setCaption('');
      setMediaFiles([]);
    //   setShowSuccess(false);
    }, 2000);
  };

  return (
    <MainLayout>
       <div className="w-full max-w-lg mx-auto p-4">
      <Card className="border-0 shadow-none">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
        

            {/* Media Upload Area */}
            <div className="space-y-4">
              {mediaFiles.length === 0 ? (
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
                  {mediaFiles.map((media, index) => (
                    <div key={index} className="relative group aspect-square">
                      {media.type === 'video' ? (
                        <video
                          src={media.url}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                      ) : (
                        <img
                          src={media.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {mediaFiles.length < 10 && (
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
            {mediaFiles.length > 0 && (
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
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || mediaFiles.length === 0}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing...
                </>
              ) : (
                'Share'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
   </MainLayout>
  );
};

export default AddPost;