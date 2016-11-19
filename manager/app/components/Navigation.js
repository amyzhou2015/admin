import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Menu, Icon, Switch, Row, Col} from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
let _menu = [],
    menuData = [];

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        let defaultOpenKeys = [],
            activeKey, topKey;
        let selectedKeys = this.props.children.props.location.pathname.split('/')[1];
        if (this.props.children.props.route.params && this.props.children.props.route.params.menu) {
            activeKey = this.props.children.props.route.params.menu;
            defaultOpenKeys.push(activeKey)
            if (activeKey.split('-') && activeKey.split('-')[1]) {
                topKey = activeKey.split('-')[0];
                defaultOpenKeys.push(topKey)
            }
        } else {
            selectedKeys = 'controlPanel';
            defaultOpenKeys = ['sub1']
        }

        this.state = {
            selectedKeys: selectedKeys,
            defaultOpenKeys: defaultOpenKeys,
            menuData: []
        };
    }

    componentDidMount() {
        const that = this;

        $.ajax({
            url: 'http://localhost:3000/users',
            type: 'GET',
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    menuData = data.data;
                    let _index = 0;
                    menuData.map((i, t) => {
                        if (i.parent_id == 1) {
                            _menu[_index] = i;
                            _menu[_index].trees = 1;
                            delete menuData[t];
                            _index++;
                        }
                    });

                    for (let i = 0; i < _index; i++) {
                        that._loadMenu(_menu[i].id, i);
                    }

                    that.setState({
                        menuData: _menu
                    })
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    }


    _loadMenu(pid, tIndex) {
        let subMenu = [],
            index = 0;
        menuData.map((i, t) => {
            if (i.parent_id == pid) {
                subMenu[index] = i;
                index++;
                delete menuData[t]
            }
        });

        _menu[tIndex].subMenu = subMenu;

        let _length = Object.keys(subMenu).length
        for (let i = 0; i < _length; i++) {
            this._loadMenu2(subMenu[i].id, tIndex, i);
        }
    }

    _loadMenu2(pid, tIndex, zIndex) {
        let subMenu = [],
            index = 0;
        menuData.map((i, t) => {
            if (i.parent_id == pid) {
                subMenu[index] = i;
                index++;
                delete menuData[t]
            }
        });

        _menu[tIndex].subMenu[zIndex].subMenu = subMenu;
    }

    handleClick(e) {
        console.log(e);
        this.setState({
            selectedKeys: e.key,
        });
    }

    render() {
        let menu = this.state.menuData.map((i, t) => {
            return (
                <SubMenu key={i.id} title={i.name}>
                    {
                        i.subMenu &&
                        i.subMenu.map((x, y) => {
                            if (x.subMenu && x.subMenu.length > 0) {
                                return <SubMenu key={x.id} title={x.name}>
                                    {
                                        x.subMenu.map((j, k) => {
                                            return <Menu.Item key={j.id}>{j.name}</Menu.Item>
                                        })
                                    }
                                </SubMenu>
                            } else {
                                return <Menu.Item key={x.id}>{x.name}</Menu.Item>
                            }
                        })
                    }
                </SubMenu>
            )
        });

        return (
            <div style={styles.control}>
                <Row style={styles.control}>
                    <Col span={4} push={0} style={styles.control}>
                        <Menu onClick={this.handleClick.bind(this)}
                              defaultOpenKeys={this.state.defaultOpenKeys}
                              selectedKeys={[this.state.selectedKeys]}
                              mode="inline"
                              theme="dark"
                              style={styles.control}
                        >
                            {menu}
                        </Menu>
                    </Col>

                    <Col span={20} pull={0} style={styles.control}>
                        <div style={styles.main}>
                            {this.props.children}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

const styles = {
    main: {
        width: "100%",
        height: "100%",
        backgroundColor: "#dddddd"
    },
    control: {
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
    }
};