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

    public static function setValue($key, $value)
    {
        if (FALSE !== self::getString($key)) {
            $where = sprintf('variable_key="%s"', $key);
            return self::updateAll(['variable_value' => $value], ['variable_key' => $key]);
        }
        $obj = new self();
        $obj->variable_key = $key;
        $obj->variable_value = $value;
        return $obj->save();
    }

    public static function getHomeSlides()
    {
        $slides = self::getJson('home_slides', true);
        usort($slides, function($a, $b)
        {
            if ($a['sort'] == $b['sort']) {
                return 0;
            }
            return ($a['sort'] < $b['sort']) ? -1 : 1;
        });
        return $slides;
    }

}
