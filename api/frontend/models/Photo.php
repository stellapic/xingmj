<?php
namespace frontend\models;

use common\enums\ThumbnailEnum;
use common\helpers\ImageHelper;

class Photo extends \common\models\Photo
{

    public function fields()
    {
        $fields = parent::fields();
        $fields['image'] = function ($model) {
            $thumbnailPath = $model->image_info[ThumbnailEnum::MEDIUM]['path'] ?? ImageHelper::convertToThumbnailPath($model->image);
            return \Yii::$app->params['fileServer'] . $thumbnailPath;
        };

        $fields['id'] = function ($model) {
            return $model->short_id;
        };

        $fields['creator'] = function ($model) {
            return User::find()->limit(1)->select('username')->where(['id' => $model->creator])->scalar();
        };

        if ($this->tags) {
            $fields['tags'] = function ($model) {
                return array_keys($model->tags);
            };
        }

        $fields['width'] = function ($model) {
            return $model->image_info[ThumbnailEnum::MEDIUM]['width'] ?? 300;
        };
        $fields['height'] = function ($model) {
            return $model->image_info[ThumbnailEnum::MEDIUM]['height'] ?? 300;
        };

        // remove some fields
        unset ($fields['short_id'], $fields['deleted'], $fields['create_at'], $fields['update_at']);

        return $fields;
    }

}
