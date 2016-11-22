import React from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';
import "../scss/global.scss";
import {Menu, Icon, Row, Col,Popconfirm,Dropdown,Badge} from 'antd';
import {Link} from 'react-router';
const SubMenu = Menu.SubMenu;
let _menu = [],
  menuData = [];

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    let defaultOpenKeys = [], selectedKeys = '', _length;
    let state = this.props.children.props.location.state;
    if (state && state.idList) {
      selectedKeys = state.idList.split(',');
      if (selectedKeys && selectedKeys.length > 0) {
        _length = selectedKeys.length;
        defaultOpenKeys = selectedKeys;
        selectedKeys = selectedKeys[_length - 1];
      } else {
        selectedKeys = [];
      }
    }

    this.state = {
      selectedKeys: selectedKeys,
      defaultOpenKeys: defaultOpenKeys,
      menuData: [],
      userName: cookie.load('userName')
    };

  }

  componentDidMount() {
    if (sessionStorage.menu && JSON.parse(sessionStorage.menu)) {
      this.setState({
        menuData: JSON.parse(sessionStorage.menu)
      })
      return;
    }

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

          sessionStorage.menu = JSON.stringify(_menu);
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

    let _length = Object.keys(subMenu).length;
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
    //console.log(e);
    this.setState({
      selectedKeys: e.key,
    });
  }

  onOpenChange(e) {
    this.props.children.props.location.state = e;
    this.setState({
      defaultOpenKeys: e,
    });
  }

  userMenuClick(e) {
    if (e.key == 'null') {
      this.setState({
        selectedKeys: "",
        defaultOpenKeys: []
      });
    } else {
      this.setState({
        selectedKeys: e.key,
      });
    }

  }

  logout() {
    cookie.remove('userName', {path: '/'});
    window.location.reload();
  }

  render() {
    let selectedKeys = this.state.selectedKeys;
    let defaultOpenKeys = this.state.defaultOpenKeys;
    let menu = this.state.menuData.map((i) => {
      return (
        <SubMenu key={i.id} title={i.name}>
          {
            i.subMenu &&
            i.subMenu.map((x) => {
              if (x.subMenu && x.subMenu.length > 0) {
                return <SubMenu key={x.id} title={x.name}>
                  {
                    x.subMenu.map((j) => {
                      if (!j.href || j.href == '') {
                        return <Menu.Item key={j.id} disabled={true}>{j.name}</Menu.Item>
                      } else {
                        if (j.href.indexOf('http') != -1) {
                          return <Menu.Item key={j.id}><a href={j.href} target="_blank">{j.name}</a></Menu.Item>
                        } else {
                          return <Menu.Item key={j.id}><Link
                            to={{ pathname: j.href, state: { idList: i.id+','+x.id+','+j.id } }}
                            data-select={i.id+','+x.id+','+j.id}>{j.name}</Link></Menu.Item>
                        }
                      }
                    })
                  }
                </SubMenu>
              } else {
                if (!x.href || x.href == '') {
                  return <Menu.Item key={x.id} disabled={true}>{x.name}</Menu.Item>
                } else {
                  return <Menu.Item key={x.id} disabled={false}><Link
                    to={{ pathname: x.href, state: { idList: i.id+','+x.id} }}>{x.name}</Link></Menu.Item>
                }

              }
            })
          }
        </SubMenu>
      )
    });

    if (this.props.children.props.location.state) {
      let _keys = this.props.children.props.location.state;
      if (_keys && _keys.idList) {
        _keys = _keys.idList.split(',');
        let _length = _keys.length;
        let openKey = _keys[_length - 1];
        selectedKeys = openKey;
        defaultOpenKeys = _keys;
      }
    }


    const userMenu = (
      <Menu onClick={this.userMenuClick.bind(this)}>
        <Menu.Item key="null">
          <Link to={{ pathname:"/", state: { idList: "" } }}>后台总览</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="30">
          <Link to={{ pathname:"/sys/user/modifyPwd", state: { idList: "27,28,30" } }}>修改密码</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={styles.control} className="main">
        <Row style={styles.control}>
          <Col span={4} push={0} style={styles.control} className="left-menu">
            <div className="top-menu">
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className="user-box">
                  <Icon type="user" className="user"/>
                  <span className="name">{this.state.userName}</span>
                </div>
              </Dropdown>
              <Popconfirm title="确定登出吗?" onConfirm={this.logout} okText="确定" cancelText="取消">
                <Icon type="logout" className="logout"/>
              </Popconfirm>
            </div>

            <Menu onClick={this.handleClick.bind(this)}
                  onOpenChange={this.onOpenChange.bind(this)}
                  selectedKeys={[selectedKeys]}
                  openKeys={defaultOpenKeys}
                  mode="inline"
                  theme="dark"
                  className="menu"
                  style={styles.yScroll}
            >
              {menu}
            </Menu>
          </Col>

          <Col span={20} pull={0} style={styles.control}>
            <div style={styles.main}>
              <div className="top-menu">
                <Badge count={5} className="notification-box">
                  <Icon type="notification" className="notification"/>
                </Badge>
              </div>
              <div className="main-content">
                {this.props.children}
              </div>
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
    backgroundColor: "#ffffff",
    overflowY: "auto",
    overflowX: "hidden",
  },
  control: {
    height: "100%",
    overflow: "hidden"
  },
  yScroll: {
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  }
};