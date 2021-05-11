<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "oa_wf_confirm_received_plan".
 *
 * @property int $confirm_received_plan_id 收款明细ID
 * @property int $workflow_id 流程ID
 * @property float|null $amount 金额
 * @property int|null $currency 币种1 - 卢布2 - 美元3 - 欧元4 - 人民币5 - 白俄卢布
 */
class BaseModel extends \yii\db\ActiveRecord
{
}
