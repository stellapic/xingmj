<?php

namespace common\models;


class Photo extends BaseModel
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'photo';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['image', 'title', 'category'], 'required'],
            [['general_status', 'is_recommend'], 'integer'],
            [['image', 'title', 'take_place', 'intro', 'graph_resolve', 'graph_position'], 'string', 'max' => 255],
            [['take_params', 'tags', 'device', 'remote_station', 'image_info'], 'safe'],
        ];
    }

    public function beforeSave($insert)
    {
        if (!parent::beforeSave($insert)) {
            return false;
        }
        // add short_id
        if ($insert) {
            $this->short_id = $this->getNanoId();
            $this->creator = \Yii::$app->user->id;
        }
        return true;
    }

}
