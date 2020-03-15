import QndReact from './qnd-react';
import * as snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';
import eventlistenersModule from 'snabbdom/modules/eventlisteners';

const reconcile = snabbdom.init([propsModule, eventlistenersModule]);

let rootVNode;
//QndReactDom.render(App, document.getElementById('root'))
const render = (el, rootDomElement) => {
  if (rootVNode == null) {
    //第一次调用 render 时
    rootVNode = rootDomElement;
  }
  rootVNode = reconcile(rootVNode, el);
};

//QndReactDom 告诉 QndReact 如何更新 DOM
QndReact.__updater = componentInstance => {
  //当调用 this.setState 的时候更新 DOM 逻辑
  //获取在 __vNode 上存储的 oldVNode
  const oldVNode = componentInstance.__vNode;
  //获取 newVNode
  const newVNode = componentInstance.render();
  //更新 __vNode
  componentInstance.__vNode = reconcile(oldVNode, newVNode);
};

const QndReactDom = {
  render,
};
export default QndReactDom;
