import { useState } from 'react';
import { View, Button, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

const HOST = '127.0.0.1'
const PORT = '8080'

const API_URL = `http://${HOST}:${PORT}/upload/`;

export default function Index() {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        uploadImage(tempFilePath);
      },
      fail: () => {
        Taro.showToast({ title: '图片选择失败', icon: 'none' });
      },
    });
  };

  const uploadImage = (filePath) => {
    setUploading(true);
    Taro.uploadFile({
      url: API_URL,
      filePath,
      name: 'file',
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.download_url) {
          setImageUrl(data.download_url);
        } else {
          Taro.showToast({ title: '上传失败', icon: 'none' });
        }
      },
      fail: () => {
        Taro.showToast({ title: '上传失败', icon: 'none' });
      },
      complete: () => {
        setUploading(false);
      },
    });
  };

  return (
    <View className="container">
      <Text className="title">证件照处理</Text>
      <Button className="upload-btn" onClick={handleUpload} disabled={uploading}>{uploading ? '上传中...' : '上传图片'}</Button>
      {imageUrl && (
        <View className="image-preview">
          <Image className="preview-img" src={imageUrl} mode="widthFix" />
          <Button className="download-btn" onClick={() => Taro.downloadFile({ url: imageUrl })}>下载图片</Button>
        </View>
      )}
    </View>
  );
}
