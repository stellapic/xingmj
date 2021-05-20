<?php
namespace frontend\models;

class Photo extends \common\models\Photo
{

    public function fields()
    {
        $fields = parent::fields();
        $fields['image'] = function ($model) {
            return \Yii::$app->params['fileServer'] . $model->image;
        };

        $fields['url'] = function ($model) {
            $prefix = '/photos/show/';
            return $prefix . $model->short_id;
        };

        $fields['creator'] = function ($model) {
            return User::find()->limit(1)->select('username')->where(['id' => $model->creator])->scalar();
        };

        if ($this->tags) {
            $fields['tags'] = function ($model) {
                return array_keys($model->tags);
            };
        }

        // remove some fields
        unset ($fields['id'], $fields['short_id'], $fields['deleted'], $fields['create_at'], $fields['update_at']);

        return $fields;
    }

}
