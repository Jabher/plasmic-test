This is a Plasmic app integration demo.

How to start:

```bash
yarn install
yarn run dev
```

Then, go to Plasmic application.

After starting a new project, click on 3 vertical dots in left top corner,
select "Configure project" option and set http://localhost:3000/provider as a provider.

After that, new components will appear.

For local development you will have to configure project.

This is currently done in `plasmic-provider/plasmic.ts`.

Config options can be copied from "code" button modal window in Plasmic UI.

After that, sync the application locally and see how it will look like use `npx plasmic sync`.


That's it!
