<?php
namespace frontend\models;

use common\helpers\ImageHelper;

class Photo extends \common\models\Photo
{

    public function fields()
    {
        $fields = parent::fields();
        $fields['image'] = function ($model) {
            return \Yii::$app->params['fileServer'] . ImageHelper::convertToThumbnailPath($model->image);
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
            return 300;
        };
        $fields['height'] = function ($model) {
            return 300;
        };

        // remove some fields
        unset ($fields['short_id'], $fields['deleted'], $fields['create_at'], $fields['update_at']);

        return $fields;
    }

}
