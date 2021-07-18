<?php

namespace backend\models\search;

use common\enums\PhotoEnum;
use common\enums\ThumbnailEnum;
use common\models\User;
use common\models\Photo;
use yii\data\ActiveDataProvider;

class PhotoSearch extends Photo
{

    public $keyword, $tag;

    public function rules()
    {
        return [
            [['keyword', 'category', 'tag', 'is_recommend'], 'safe'],
        ];
    }

    public function search($params)
    {
        $query = self::find();

        // $query->select('short_id, image, title, creator, image_info');

        // add common conditions here
        // $query->andWhere(['general_status' => PhotoEnum::GENERAL_STATUS_READY]);

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
            'is_recommend' => $this->is_recommend,
        ]);

        if ($this->tag) {
            $query->andWhere("tags->'$.{$this->tag}' = 1");
        }

        if ($this->keyword) {
            $query->andFilterWhere([
                'OR',
                ['like', 'title', $this->keyword],
                ['like', 'intro', $this->keyword],
                ['like', 'take_place', $this->keyword],
                ['category' => \common\models\PhotoCategory::find()->select('category_name')->where(['like', 'category_title', $this->keyword])],
                ['creator' => User::find()->select('id')->where(['like', 'username', $this->keyword])],
            ]);
        }

        // echo "<pre>";
        // print_r($params);
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
                return ImageHelper::convertToThumbnailPath(\Yii::$app->params['fileServer'] . $this->image, ThumbnailEnum::TINY);
            },
            'title',
            'creator' => function () {
                return User::find()->limit(1)->select('username')->where(['id' => $this->creator])->scalar();
            },
            'tags' => function () {
                return $this->tags ? array_keys($this->tags) : [];
            },
        ];
    }

}
