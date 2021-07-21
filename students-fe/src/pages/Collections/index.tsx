import React, { useState, useEffect  } from 'react';
import { Tabs, Input, Row, Col } from 'antd';
// import CollectionsPhotoList from '../../components/CollectionsPhotoList';
import ImageCollection from '../../components/ImageCollection';
import { apiPhotoCategory } from '../../request/api';

const { TabPane } = Tabs;
const { Search } = Input;

type tabProps = {
  category_name: string,
  category_title: string
}

const defaultTabList = [
  {
      "category_name": "all",
      "category_title": "全部"
  }
]

const Collections: React.FC = () => {
  const [tabList, setTabList] = useState<Array<tabProps>>(defaultTabList)
  useEffect(() => {
    apiPhotoCategory().then(data => {
      setTabList([...defaultTabList, ...data.data])
    })
  }, [])
  return (
    <div style={{maxWidth: "1200px", width: "80%", minHeight: "90vh", margin: "0 auto", padding: "20px 0"}}>
      {/* 搜索栏 */}
      <Row justify="center" align="middle" gutter={20}>
        <Col span={15}>
          <Search
              placeholder={'搜索 ' + tabList[0].category_title}
              size="large"
              allowClear
              enterButton="搜索"
              style={{ width: "100%" }}
            />
        </Col>
      </Row>
      {/* 列表页导航栏 */}
      {/* <CollectionsCategory></CollectionsCategory> */}
      <Tabs defaultActiveKey={tabList[0].category_name}>
        {
          tabList.map(tab => {
            return (
            <TabPane key={tab.category_name} tab={tab.category_title}>
              <ImageCollection categoryName={tab.category_name}></ImageCollection>
            </TabPane>
            )
          })
        }
      </Tabs>
      {/* 列表页详情 */}
    </div>
  );
}
export default Collections;