import { h } from 'snabbdom';

const createElement = (type, props = {}, ...children) => {
  /**
   * 如果是类组件
   * 1.创建一个实例
   * 2.调用实例的 render 方法
   */
  if (type.prototype && type.prototype.isQndReactClassComponent) {
    const componentInstance = new type(props);

    componentInstance.__vNode = componentInstance.render();
    //增加钩子函数(当虚拟DOM被添加到真实DOM节点上时)
    componentInstance.__vNode.data.hook = {
      create: () => {
        componentInstance.componentDidMount();
      },
    };
    return componentInstance.__vNode;
  }

  //如果是函数组件，那么调用它，并返回执行结果
  if (typeof type == 'function') {
    return type(props);
  }

  props = props || {};
  let dataProps = {};
  let eventProps = {};

  for (let propKey in props) {
    // event 属性总是以 `on` 开头
    if (propKey.startsWith('on')) {
      const event = propKey.substring(2).toLowerCase();
      eventProps[event] = props[propKey];
    } else {
      dataProps[propKey] = props[propKey];
    }
  }
  // props -> snabbdom's internal text attributes
  // on -> snabbdom's internal event listeners attributes
  return h(type, { props: dataProps, on: eventProps }, children);
};

class Component {
  constructor() {}

  componentDidMount() {}

  setState(partialState) {
    this.state = {
      ...this.state,
      ...partialState,
    };
    //调用 QndReactDom 提供的 __updater 方法
    QndReact.__updater(this);
  }

  render() {}
}

//给 Component 组件添加静态属性来区分是函数还是类
Component.prototype.isQndReactClassComponent = true;

// 像 React.createElement 一样导出
const QndReact = {
  createElement,
  Component,
};

export default QndReact;
