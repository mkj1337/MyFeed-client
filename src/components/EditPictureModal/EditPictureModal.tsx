import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import './EditPictureModal.scss';
import { IoClose } from 'react-icons/io5';
import getCroppedImg from './canvas';

interface EditPictureModalProps {
  image: string;
  onSave?: (croppedImage: Blob) => void;
  onClose: (data: string) => void;
  closePrev: (data: boolean) => void;
  preview: (croppedImage: string | null) => void;
  cropShape?: 'round' | 'rect';
  aspect: number;
  output: any;
}

const EditPictureModal: React.FC<EditPictureModalProps> = ({
  image,
  closePrev,
  preview,
  onClose,
  cropShape,
  aspect,
  output,
}: EditPictureModalProps) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [, setCroppedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [croppedArea, setCroppedArea] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);

  const onCropComplete = (
    croppedAreaPercentage: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
  ) => {
    console.log(croppedAreaPercentage);

    setCroppedArea(croppedAreaPixels);
  };

  const handleClose = () => {
    onClose && onClose('');
    closePrev && closePrev(true);
  };

  useEffect(() => {
    closePrev(false);
  }, [image]);

  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [image]);

  const showCroppedImage = async () => {
    try {
      if (image && croppedArea) {
        const croppedImageUrl = await getCroppedImg(image, croppedArea);

        if (croppedImageUrl) {
          setCroppedImage(croppedImageUrl);
          preview(croppedImageUrl);
          await fetch(croppedImageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              if (blob) {
                const fileName = `image-${new Date().toISOString()}.jpg`;
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                output(file);
              } else {
                console.error('Failed to create Blob from croppedImageUrl');
              }
            })
            .catch((error) => {
              console.error('Error creating Blob from croppedImageUrl:', error);
            });
          onClose('');
          closePrev(true);
        } else {
          console.error('getCroppedImg returned null');
        }
      }
    } catch (e) {
      console.error('Error in showCroppedImage:', e);
    }
  };

  return (
    <div className={`editPictureModal`}>
      <div className="modal">
        <div className="top">
          <h2>Edit Picture</h2>
          <div className="close-btn" onClick={handleClose}>
            <IoClose />
          </div>
        </div>
        <div className="bottom">
          {image && (
            <>
              <div className="content">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape={cropShape}
                  showGrid={false}
                />
              </div>

              <input
                ref={inputRef}
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const selectedImage = e.target.files[0];
                    const imageUrl = URL.createObjectURL(selectedImage);
                    image && image !== imageUrl && preview && preview(null);
                    setCroppedImage(null);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    onClose && onClose(imageUrl);
                  }
                }}
              />
            </>
          )}
          <button onClick={showCroppedImage}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default EditPictureModal;
