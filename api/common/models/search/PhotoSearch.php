<?php

namespace common\models\search;

use common\models\Photo;
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

    public function fields()
    {
        $fields = parent::fields();
        $fields['image'] = function ($model) {
            return \Yii::$app->params['fileServer'] . $model->image;
        };

        $fields['url'] = function ($model) {
            $prefix = '/photos/show/';
            return $prefix . $model->id;
        };

        unset ($fields['image']);

        return $fields;
    }

    public function search($params)
    {
        $query = self::find();

        $query->select('id, image, title, creator');

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'page' => isset($params['page']) ? $params['page'] - 1 : 0,
                'pageSize' => isset($params['pageSize']) ? $params['pageSize'] : 20,
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

}
