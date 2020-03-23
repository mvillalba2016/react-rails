import {
    types,
    SnapshotIn,
    destroy
  } from "mobx-state-tree";

  export const Image = types.model({
    url: types.optional(types.string, ''),
    width: types.optional(types.string, ''),
    height: types.optional(types.string, '')
  });

  export const Source = types.model({
    source: types.optional(Image, {})
  });

  export const Preview = types.model({
    // images: types.optional(types.array(Source), [])
    enabled: types.optional(types.boolean, false)
  });
  
  export const PostItem = types
    .model({
      id: types.optional(types.string, ''),
      title: types.optional(types.string, ''),
      author: types.optional(types.string, ''),
      created_utc: types.optional(types.number, 0),
      num_comments: types.optional(types.number, 0),
      read: types.optional(types.boolean, false),
      // preview: types.reference(Preview)
    })
    .actions(self => ({
      changeRead() {
        self.read = true;
      }
    }));
  
  export const PostList = types
    .model({
      items: types.optional(types.array(PostItem), []),
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
      async load() {
        if (self.loading || self.apiCalled) {
          return;
        }
        this.setLoad(true);
        this.setApiCalled(true);
        try {
          const response = await fetch('http://localhost:1313/reddit/list');
          this.setItems(await response.json());
          this.setLoad(false);
          this.setError(false);
        } catch(error) {
          console.log({error});
          this.setLoad(false);
          this.setError(true);
        }
      },
      remove(item: SnapshotIn<typeof PostItem>) {
        destroy(item);
      }
    }))
    .views(self => ({
      get totalItems() {
        return self.items.length;
      },
      get isLoading() {
        return self.loading
      },
      get isError() {
        return self.error
      },
      get listItems() {
        return self.items;
      },
}));