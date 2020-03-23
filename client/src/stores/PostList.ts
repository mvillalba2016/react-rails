import {
    types,
    SnapshotIn,
    destroy
  } from "mobx-state-tree";
  import _ from 'lodash';

  export const Image = types.model({
    url: types.optional(types.string, ''),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0)
  });

  export const Source = types.model({
    source: types.maybe(Image),
    id: types.optional(types.string, '')
  });

  const Preview = types.model({
    images: types.optional(types.array(Source), []),
    enabled: types.optional(types.boolean, false)
  });

  const ItemView = types.model({
    id: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    author: types.optional(types.string, ''),
    created_utc: types.number,
    num_comments: types.optional(types.number, 0),
    url: types.optional(types.string, ''),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
  });
  
  export const PostItem = types
    .model({
      id: types.optional(types.string, ''),
      title: types.optional(types.string, ''),
      author: types.optional(types.string, ''),
      thumbnail: types.optional(types.string, ''),
      created_utc: types.optional(types.number, 0),
      thumbnail_width: types.optional(types.number, 0),
      thumbnail_height: types.optional(types.number, 0),
      num_comments: types.optional(types.number, 0),
      read: types.optional(types.boolean, false),
      preview: types.maybe(Preview)
    })
    .actions(self => ({
      changeRead() {
        self.read = true;
      }
    }));
  
  export const PostList = types
    .model({
      items: types.optional(types.array(PostItem), []),
      itemsOriginal: types.optional(types.array(PostItem), []),
      itemView: types.maybe(ItemView),
      apiCalled: types.boolean,
      loading: types.boolean,
      error: types.boolean
    })
    .actions(self => ({
      setApiCalled(value: boolean) {
        self.apiCalled = value;
      },
      setLoad(value: boolean) {
        self.loading = value;
      },
      setError(value: boolean) {
        self.error = value;
      },
      setItems(items: any) {
        self.items = items;
      },
      setItemsOriginal(items: any) {
        self.itemsOriginal = items;
      },
      restoreOriginal() {
        const items = self.itemsOriginal.filter(i => i);
        if (self.itemView) {
          this.removeItem(self.itemView);
        }
        this.setItems(_.cloneDeep(items));
      },
      mapItems(items: any) {
        const initPreview = (item: any) => {
          const preview = {
            images: [{
              source: { url: '', width: 0, height: 0 },
              id: ''
            }],
            enabled: false
          };
          return {
            ...item,
            ...item,
            preview: item.preview ?  item.preview : preview,
            thumbnail: item.thumbnail ? item.thumbnail : '',
            thumbnail_width: item.thumbnail_width ? item.thumbnail_width : 0,
            thumbnail_height: item.thumbnail_height ? item.thumbnail_height : 0
          };
        };
        return items.map((item: any) => initPreview(item));
      },
      async load() {
        if (self.loading || self.apiCalled) {
          return;
        }
        this.setLoad(true);
        try {
          const response = await fetch('http://localhost:1313/reddit/list');
          const items = this.mapItems(await response.json());
          this.setLoad(false);
          if (!items.length) {
            this.load();
            return;
          }
          this.setApiCalled(true);
          this.setItemsOriginal(items);
          this.setItems(items);
          this.setError(false);
        } catch(error) {
          console.log({error});
          this.setLoad(false);
          this.setError(true);
        }
      },
      remove(id?: string) {
        const items = self.items.filter(item => item.id !== id);
        this.setItems(items);
        id === self.itemView?.id && this.removeItem(self.itemView)
      },
      removeItem(item: any) {
        destroy(item)
      },
      markRead(id: string) {
        const index = self.items.findIndex(item => item.id === id);
        self.items[index].read = true;
      },
      view(itemView: any) {
        self.itemView = itemView;
        this.markRead(itemView.id);
      }
    }))
    .views(self => ({
      get totalItems() {
        return self.items.length;
      },
}));