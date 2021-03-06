import React from 'react';
import router from 'umi/router';
import memoizeOne from 'memoize-one';
import QueueAnim from 'rc-queue-anim';
import { PureComponent } from 'react';
import styles from '../BasicLayout.less';
import RightContent from './RightContent';
import { Layout, Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import MenuItem from 'antd/lib/menu/MenuItem';
import { Route, pathnameToArr } from '@/utils/utils';
import { FormattedMessage } from 'umi-plugin-locale';
import { CheckAuth, Scope } from '@/components/Authorized';

export interface HeaderProps {
  currentScope: Scope;
  location: Location;
  route: Route;
}

export default class Header extends PureComponent<HeaderProps> {
  pathnameToArr = memoizeOne(pathnameToArr);

  menuArr: React.ReactNode[] = [];

  constructor(props: HeaderProps) {
    super(props);
    this.menuArr = this.routeToMenu(props.route.routes, props.currentScope);
  }

  handleClick = ({ key, item }: ClickParam): void => {
    const { location } = this.props;
    if (item.props['data-type'] !== 'href' && key !== location.pathname) router.push(key);
  };

  routeToMenu = (routes: Route[], currentScope: Scope): React.ReactNode[] => {
    return routes
      .filter(({ hideInMenu, path, href }) => !hideInMenu && (path || href))
      .filter(({ scope }) => CheckAuth(scope, currentScope))
      .map(route =>
        route.href
          ? route.name && (
              <MenuItem key={route.href} data-type="href">
                <a href={route.href} target="_blank" rel="noopener noreferrer">
                  {route.icon && <Icon type={route.icon} />}
                  <FormattedMessage id={route.name} />
                </a>
              </MenuItem>
            )
          : route.name && (
              <MenuItem key={route.path} data-type="path">
                {route.icon && <Icon type={route.icon} />}
                <FormattedMessage id={route.name} />
              </MenuItem>
            ),
      );
  };

  render() {
    const { pathname } = this.props.location;
    return (
      <Layout.Header className={styles.header}>
        <QueueAnim
          type="left"
          delay={200}
          componentProps={{
            className: styles.headerContainer,
          }}
        >
          <Menu
            key="leftHeader"
            mode="horizontal"
            onClick={this.handleClick}
            selectedKeys={this.pathnameToArr(pathname)}
          >
            {this.menuArr}
          </Menu>
          <RightContent key="rightHeader" />
        </QueueAnim>
      </Layout.Header>
    );
  }
}
