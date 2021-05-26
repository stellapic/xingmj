<?php

namespace common\models;

/**
 * RuntimeVariables model
 *
 * @property integer $id
 * @property string $variable_key
 * @property string $variable_value
 * @property datetime $created_at
 * @property datetime|null $updated_at
 */
class RuntimeVariables extends BaseModel
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'sys_runtime_variables';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['variable_key', 'variable_value'], 'required'],
        ];
    }

    public static function getString($variableKey)
    {
        return self::find()->limit(1)->select('variable_value')->where([
            'variable_key' => $variableKey,
        ])->scalar();
    }

    public static function getIngeter($variableKey)
    {
        return (int)self::getString($variableKey);
    }

    public static function getJson($variableKey, $asArray=false)
    {
        return json_decode(self::getString($variableKey), $asArray);
    }

}
