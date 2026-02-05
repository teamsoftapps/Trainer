// import axiosBaseURL from '../services/AxiosBaseURL';

// export const uploadStory = (file, thumbnailFile = null) => {
//   const formData = new FormData();

//   formData.append('media', {
//     uri: file.path,
//     type: file.mime,
//     name: 'story',
//   });

//   if (thumbnailFile) {
//     formData.append('thumbnail', {
//       uri: thumbnailFile.path,
//       type: 'image/jpeg',
//       name: 'thumb.jpg',
//     });
//   }

//   return axiosBaseURL.post('trainer/upload-story', formData, {
//     headers: {'Content-Type': 'multipart/form-data'},
//   });
// };

// export const uploadPost = (file, caption = '', thumbnailFile = null) => {
//   const formData = new FormData();

//   formData.append('media', {
//     uri: file.path,
//     type: file.mime,
//     name: 'post',
//   });

//   if (thumbnailFile) {
//     formData.append('thumbnail', {
//       uri: thumbnailFile.path,
//       type: 'image/jpeg',
//       name: 'thumb.jpg',
//     });
//   }

//   formData.append('caption', caption);

//   return axiosBaseURL.post('trainer/upload-post', formData, {
//     headers: {'Content-Type': 'multipart/form-data'},
//   });
// };

import axiosBaseURL from '../services/AxiosBaseURL';

export const uploadStory = (file, thumbnailFile, onProgress) => {
  const formData = new FormData();

  formData.append('media', {
    uri: file.path,
    type: file.mime,
    name: 'story',
  });

  if (thumbnailFile) {
    formData.append('thumbnail', {
      uri: thumbnailFile.path,
      type: 'image/jpeg',
      name: 'thumb.jpg',
    });
  }

  return axiosBaseURL.post('trainer/upload-story', formData, {
    headers: {'Content-Type': 'multipart/form-data'},

    onUploadProgress: progressEvent => {
      if (!onProgress) return;

      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      onProgress(percent);
    },
  });
};

export const uploadPost = (file, caption, thumbnailFile, onProgress) => {
  const formData = new FormData();

  formData.append('media', {
    uri: file.path,
    type: file.mime,
    name: 'post',
  });

  if (thumbnailFile) {
    formData.append('thumbnail', {
      uri: thumbnailFile.path,
      type: 'image/jpeg',
      name: 'thumb.jpg',
    });
  }

  formData.append('caption', caption);

  return axiosBaseURL.post('trainer/upload-post', formData, {
    headers: {'Content-Type': 'multipart/form-data'},

    onUploadProgress: progressEvent => {
      if (!onProgress) return;

      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      onProgress(percent);
    },
  });
};
