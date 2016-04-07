import Alt from 'alt';

let dispatcher = new Alt();

if (process.env.NODE_ENV !== 'production') {
  Alt.debug('alt', dispatcher);
}

export default dispatcher;
