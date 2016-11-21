import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import $ from 'jquery';
import "../scss/global.scss";
import {Menu, Icon, Switch, Row, Col} from 'antd';
import {Link} from 'react-router';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
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
      userName:cookie.load('userName')
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
    console.log(e);
    this.setState({
      selectedKeys: e.key,
    });
  }

  userClick(){
    console.log(1);
  }

  logout(){
    cookie.remove('userName', { path: '/' });
    window.location.reload();
  }

  render() {
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
                      if (j.href.indexOf('http') != -1) {
                        return <Menu.Item key={j.id}><a
                          href={j.href} target="_blank">{j.name}</a></Menu.Item>
                      } else {
                        return <Menu.Item key={j.id}><Link
                          to={{ pathname: j.href, state: { idList: i.id+','+x.id+','+j.id } }}>{j.name}</Link></Menu.Item>
                      }


                    })
                  }
                </SubMenu>
              } else {
                return <Menu.Item key={x.id}><Link
                to={{ pathname: x.href, state: { idList: i.id+','+x.id} }}>{x.name}</Link></Menu.Item>
              }
            })
          }
        </SubMenu>
      )
    });

    return (
      <div style={styles.control} className="main">
        <Row style={styles.control}>
          <Col span={4} push={0} style={styles.control} className="left-menu">
            <div className="top-menu">
              <div className="user-box" onClick={this.userClick}>
                <Icon type="user" className="user" />
                <span className="name">{this.state.userName}</span>
              </div>

              <Icon type="logout" className="logout" onClick={this.logout}/>
            </div>

            <Menu onClick={this.handleClick.bind(this)}
                  defaultOpenKeys={this.state.defaultOpenKeys}
                  selectedKeys={[this.state.selectedKeys]}
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
    overflow:"hidden"
  },
  yScroll:{
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  }
};