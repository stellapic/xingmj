<?php
namespace frontend\models;

class Photo extends \common\models\Photo
{

    public function fields()
    {
        $fields = parent::fields();
        $fields['image'] = function ($model) {
            return \Yii::$app->params['fileServer'] . $model->photo_url;
        };

        $fields['url'] = function ($model) {
            $prefix = '/photos/show/';
            return $prefix . $model->id;
        };

        $fields['creator'] = function ($model) {
            return User::find()->limit(1)->select('username')->where(['id' => $model->creator])->scalar();
        };

        unset ($fields['photo_url']);

        return $fields;
    }

}
