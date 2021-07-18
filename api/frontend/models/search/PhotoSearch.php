<?php

namespace frontend\models\search;

use common\enums\PhotoEnum;
use common\enums\ThumbnailEnum;
use common\helpers\ImageHelper;
use common\models\User;
use frontend\models\Photo;
use yii\data\ActiveDataProvider;

class PhotoSearch extends Photo
{

    public $keyword, $tag;

    public function rules()
    {
        return [
            [['keyword', 'category', 'tag'], 'safe'],
        ];
    }

    public function search($params)
    {
        $query = self::find();

        $query->select('short_id, image, title, creator, image_info, take_date');

        // add common conditions here
        $query->andWhere(['general_status' => PhotoEnum::GENERAL_STATUS_READY]);

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'page' => isset($params['page']) ? (int)$params['page'] - 1 : 0,
                'pageSize' => isset($params['size']) ? (int)$params['size'] : 20,
            ],
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC,
                ],
            ]
        ]);

        $this->setAttributes($params);

        $shouldReturnEmpty = !$this->validate();
        if ($shouldReturnEmpty) {
            // uncomment the following line if you do not want to return any records when validation fails
            $query->where('0=1');
            // p($this->getErrors());exit;
            return $dataProvider;
        }

        $query->andFilterWhere([
            'category' => $this->category,
        ]);

        if ($this->tag) {
            $query->andWhere("tags->'$.{$this->tag}' = 1");
        }

        if ($this->keyword) {
            $query->andFilterWhere([
                'OR',
                ['like', 'title', $this->keyword],
                ['like', 'intro', $this->keyword],
            ]);
        }

        // p($params);
        // echo $query->createCommand()->getRawSql();exit;
        return $dataProvider;
    }

    public function fields()
    {
        return [
            'id' => function () {
                return $this->short_id;
            },
            'image' => function () {
                return ImageHelper::convertToThumbnailPath(\Yii::$app->params['fileServer'] . $this->image, ThumbnailEnum::MEDIUM);
            },
            'title',
            'creator' => function () {
                return User::find()->limit(1)->select('username')->where(['id' => $this->creator])->scalar();
            },
            'width' => function () {
                return $this->image_info[ThumbnailEnum::MEDIUM]['width'] ?? 600;
            },
            'height' => function () {
                return $this->image_info[ThumbnailEnum::MEDIUM]['height'] ?? 600;
            },
            'tags' => function () {
                return $this->tags ? array_keys($this->tags) : [];
            },
            'take_date',
        ];
    }

}
