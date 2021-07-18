<?php

namespace backend\models\search;

use common\models\PhotoComment;
use common\models\User;
use common\enums\ThumbnailEnum;
use yii\data\ActiveDataProvider;

class PhotoCommentSearch extends PhotoComment
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

        if ($this->keyword) {
            $query->andFilterWhere([
                'OR',
                ['like', 'content', $this->content],
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
            'id',
            'title' => function () {
                $image = Photo::find()->select('image')->where(['id' => $this->photo_id])->scalar();
                return ImageHelper::convertToThumbnailPath(\Yii::$app->params['fileServer'] . $image, ThumbnailEnum::TINY);
            },
            'content',
            // 'user_id' => function () {
            //     return User::find()->limit(1)->select('username')->where(['id' => $this->user_id])->scalar();
            // },
            'created_at',
        ];
    }

}
