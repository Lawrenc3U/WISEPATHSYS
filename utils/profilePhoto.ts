import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

/** Max edge length so the base64 payload stays Firestore-friendly. */
const MAX_EDGE = 320;
const JPEG_QUALITY = 0.55;

/**
 * Opens the photo library, resizes the image, and returns a data URI
 * (`data:image/jpeg;base64,...`) ready to store on UserProfile.photoBase64.
 */
export async function pickProfilePhotoBase64(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Photo access needed',
      'Allow photo library access to set your profile picture.'
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return null;
  }

  const asset = result.assets[0];
  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: MAX_EDGE } }],
    {
      compress: JPEG_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    }
  );

  if (!manipulated.base64) {
    Alert.alert('Could not read photo', 'Try another image.');
    return null;
  }

  return `data:image/jpeg;base64,${manipulated.base64}`;
}

/** Use with <Image source={{ uri }} /> — accepts data URI or plain base64. */
export function profilePhotoUri(photoBase64?: string | null): string | null {
  if (!photoBase64 || !photoBase64.trim()) return null;
  if (photoBase64.startsWith('data:')) return photoBase64;
  return `data:image/jpeg;base64,${photoBase64}`;
}

export const PROFILE_PHOTO_HINT =
  Platform.OS === 'web'
    ? 'Choose a square photo from your device'
    : 'Tap to choose a photo from your library';
