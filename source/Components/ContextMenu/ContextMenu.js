import videojs from 'video.js';

import './ContextMenu.scss';
import './Item/ContextMenuToggleLoop.js';
import './Item/AboutThisPlayer.js';

import CloseContextMenu from './CloseContextMenu';

const Menu = videojs.getComponent('Menu');

class ContextMenu extends Menu {
  constructor(player, options) {
    super(player, options);

    this.addClass('vjs-context-menu');

    this.hide();

    this.player_.on('contextmenu', this.onContextmenu.bind(this));
  }

  createEl(...args) {
    const el = super.createEl(...args);

    const layer = new CloseContextMenu(this.player_, {
      menu: this
    });

    el.insertBefore(layer.el_, el.firstElementChild);

    return el;
  }

  show(x, y, w, h) {
    super.show();

    this.el_.append.style.width = '';
    this.el_.append.style.height = '';
    this.el_.style.width = '';
    this.el_.style.height = '';

    const width = this.el_.getBoundingClientRect().width;
    const height = this.el_.getBoundingClientRect().height;

    const posX = w - width;
    const posY = h - height;

    const calcX = () => {
      if (x > posX) {
        return (x - posX) * -1;
      }
      return '0';
    }

    const calcY = () => {
      if (y > posY) {
        return (y - posY) * -1;
      }
      return '0';
    }

    const marginTop = calcY();
    const marginLeft = calcX();

    this.el_.style.top = y + 'px';
    this.el_.style.left = x + 'px';
    this.el_.style.marginTop = marginTop + 'px';
    this.el_.style.marginLeft = marginLeft + 'px';

    this.el_.append.style.width = width + 'px';
    this.el_.append.style.height = height + 'px';
    this.el_.style.width = width + 'px';
    this.el_.style.height = height + 'px';
  }

  onContextmenu(event) {
    event.preventDefault();

    const rect = this.player_.el().getBoundingClientRect();
    const { pageX, pageY } = event;

    if (
      pageY > rect.y &&
      pageY - rect.height < rect.y &&
      pageX > rect.x &&
      pageX - rect.width < rect.x
    ) {
      const x = pageX - rect.x;
      const y = pageY - rect.y;
      const w = rect.width;
      const h = rect.height;

      this.show(x, y, w, h);
    } else {
      this.hide();
    }
  }

  handleClick(evt) {
    if (evt.button || evt.button === 0) {
      if (evt.button !== 2) {
        this.hide();
      }
    }
  }
}

ContextMenu.prototype.options_ = {
  children: ['ContextMenuToggleLoop', 'AboutThisPlayer']
};

videojs.registerComponent('ContextMenu', ContextMenu);

videojs.getComponent('Player').prototype.options_.children.push('ContextMenu');
