if(location.protocol === 'http:' && location.hostname !== 'localhost'){
  location.href = `https://${location.host}${location.pathname}${location.search}`;
}

var exampleCallback = function() {
  console.log("Order complete!");
};

// window.EBWidgets.createWidget({
//   widgetType: "checkout",
//   eventId: "103977166504",
//   modal: true,
//   modalTriggerElementId: "example-widget-trigger",
//   onOrderComplete: exampleCallback
// });
window.EBWidgets.createWidget({
widgetType: "checkout",
eventId: "103977166504",
iframeContainerId: "eventbrite-widget-container",
iframeContainerHeight: window.innerWidth > 768 ? window.innerHeight*0.9 : window.innerHeight,
// iFrameAutoAdapt: 90,
onOrderComplete: exampleCallback
});