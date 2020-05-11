[saufchat-ui](../README.md) › [Globals](../globals.md) › ["router/index"](_router_index_.md)

# Module: "router/index"

## Index

### Variables

* [router](_router_index_.md#const-router)
* [routes](_router_index_.md#const-routes)

## Variables

### `Const` router

• **router**: *VueRouter‹›* = new VueRouter({
	routes,
})

*Defined in [router/index.ts:24](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/router/index.ts#L24)*

___

### `Const` routes

• **routes**: *object | object[]* = [
	{
		path: '/',
		name: 'home',
		component: Home,
	},
	{
		path: '/room/:roomId',
		name: 'room',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ '../views/Room.vue'),
	},
]

*Defined in [router/index.ts:7](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/router/index.ts#L7)*
