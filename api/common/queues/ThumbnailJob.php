<?php

namespace common\queues;

use common\helpers\ImageHelper;
use common\models\Photo;

/**
 * 自动生成缩略图(w=300)
 * command: /usr/bin/gm convert {source} -scale "1200x1200>" {target}
 * 
 */
class ThumbnailJob extends \yii\base\BaseObject implements \yii\queue\RetryableJobInterface
{
    public $photo_id;
    public $photo_path;

    public function execute($queue)
    {
        $spec = \common\enums\ThumbnailEnum::MEDIUM;
        $sourcePath = \Yii::$app->params['uploadPath'] . $this->photo_path;
        $thumbnailPath = ImageHelper::convertToThumbnailPath($this->photo_path, $spec);
        $absoluteThumbnailPath = \Yii::$app->params['uploadPath'] . '/thumbnail/' . $thumbnailPath;
        $command = "/usr/bin/gm convert {$sourcePath} -scale \"300x300>\" {$absoluteThumbnailPath}";
        system($command, $return_var);
        if (!file_exists($absoluteThumbnailPath)) {
            throw new \common\base\BaseException("thumbnail file not exists, try again later.");
        }
        // read thumbnail width and height
        $info = getimagesize($absoluteThumbnailPath);
        list($width, $height) = $info;
        $photo = Photo::findOne($this->photo_id);
        $photo->image_info[$spec] = [
            'path' => $thumbnailPath,
            'width' => $width,
            'height' => $height,
        ];
        $photo->save(true, ['image_info']);
    }

    /**
     * @inheritdoc
     */
    public function getTtr()
    {
        return 60;
    }

    /**
     * @inheritdoc
     */
    public function canRetry($attempt, $error)
    {
        return $attempt < 3;
    }
}
