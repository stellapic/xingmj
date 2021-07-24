<?php

namespace common\models;


/**
 * This is the model class for table "photo".
 *
 * @property int $id
 * @property string|null $short_id 短id
 * @property string|null $image 图片地址
 * @property string|null $image_info 不同尺寸图片的规格信息
 * @property string|null $title 图片标题
 * @property string|null $category 图片类型
 * @property string|null $take_date 拍摄日期
 * @property string|null $take_place 拍摄地点
 * @property string|null $take_params 拍摄参数
 * @property string|null $tags 用户标签
 * @property string|null $intro 作品介绍
 * @property string|null $device 设备信息
 * @property string|null $remote_station 远程台信息
 * @property string|null $graph_resolve 解析图
 * @property string|null $graph_position 天球定位图
 * @property int|null $thumbs_count 点赞数量
 * @property int|null $favorites_count 收藏数量
 * @property int|null $general_status 状态：0-初始状态，列表不可见；1-列表可见状态
 * @property int|null $deleted 删除状态：0-正常；1-删除
 * @property int|null $creator 发布用户
 * @property string|null $create_at 发布时间
 * @property string|null $update_at 更新时间
 * @property int|null $is_recommend 是否推荐：0-否；1-是
 */
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

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'short_id' => '短ID',
            'image' => '图片',
            'image_info' => '图片信息',
            'title' => '标题',
            'category' => '类别',
            'take_date' => '拍摄时间',
            'take_place' => '拍摄地点',
            'take_params' => '拍摄参数',
            'tags' => '标签',
            'intro' => '简介',
            'device' => '设备信息',
            'remote_station' => '远程台信息',
            'graph_resolve' => '解析图',
            'graph_position' => '天球定位图',
            'thumbs_count' => '点赞数量',
            'favorites_count' => '收藏数量',
            'comments_count' => '评论数量',
            'general_status' => '状态',
            'deleted' => 'Deleted',
            'creator' => '上传人',
            'create_at' => '上传时间',
            'update_at' => 'Update At',
            'is_recommend' => '是否精选',
        ];
    }

    public function getAnnotatedImage()
    {
        if ($this->graph_resolve) {
            return \Yii::$app->params['fileServer'] . $this->graph_resolve;
        }
        return '';
    }

    public function getPositionImage()
    {
        if ($this->graph_position) {
            return \Yii::$app->params['fileServer'] . $this->graph_position;
        }
        return '';
    }

    public function getZoomImage()
    {
        if ($this->graph_zoom) {
            return \Yii::$app->params['fileServer'] . $this->graph_zoom;
        }
        return '';
    }

    public function getPreviewUrl()
    {
        return '/photo/show/' . $this->short_id;
    }


}
