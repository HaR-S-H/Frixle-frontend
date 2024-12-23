import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Edit3, Upload } from "lucide-react";
import { UserData } from '@/context/UserContext';

const EditProfileDialog = ({ user }) => {
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = UserData();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleResetAvatar = () => {
    setPreviewUrl(user?.avatar || null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Create FormData to send both avatar and bio
      const formData = new FormData();
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }
      formData.append("bio", bio);

      // Call updateProfile with FormData
      await updateProfile(formData);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg w-[95%] p-4 sm:p-6 mx-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              
              <label 
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                htmlFor="avatar-upload"
              >
                <Upload className="h-6 w-6 text-white" />
              </label>
            </Avatar>
          </div>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="w-full space-y-2">
            <Textarea
              placeholder="Write something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="resize-none"
              rows={4}
            />
            <p className="text-sm text-muted-foreground text-right">
              {bio.length}/500
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={handleResetAvatar}
            disabled={previewUrl === user?.avatar && !selectedFile}
            className="w-full sm:w-auto"
          >
            Reset Avatar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
