const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});

const layer = new Konva.Layer();

const area = stage.width() * stage.height();
const num = 100;
const radius = area / (num * 500);
for (let i=0; i<num; i++) {
  layer.add(new Konva.Circle({
    x: stage.width() * Math.random(),
    y: stage.height() * Math.random(),
    radius,
    fill: 'blue',
  }));
}

// add the layer to the stage
stage.add(layer);
pinchZoomWheelEvent(stage);
pinchZoomTouchEvent(stage);
let things = [];
// For desktop
function pinchZoomWheelEvent(stage) {
  if (stage) {
    stage.getContent().addEventListener('wheel', (wheelEvent) => {
      wheelEvent.preventDefault();
      const oldScale = stage.scaleX();

      const pointer = stage.getPointerPosition();
      const startPos = {
        x: pointer.x / oldScale - stage.x() / oldScale,
        y: pointer.y / oldScale - stage.y() / oldScale,
      };

      const deltaYBounded = !(wheelEvent.deltaY % 1) ? Math.abs(Math.min(-10, Math.max(10, wheelEvent.deltaY))) : Math.abs(wheelEvent.deltaY);
      const scaleBy = 1.01 + deltaYBounded / 70;
      const newScale = wheelEvent.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      stage.scale({ x: newScale, y: newScale });

      const newPosition = {
        x: (pointer.x / newScale - startPos.x) * newScale,
        y: (pointer.y / newScale - startPos.y) * newScale,
      };
      stage.position(newPosition);
      stage.batchDraw();
    });
  }
}


// For mobile
let lastDist;
let point;

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
}

function clientPointerRelativeToStage(clientX, clientY, stage) {
  return {
    x: clientX - stage.getContent().offsetLeft,
    y: clientY - stage.getContent().offsetTop,
  }
}

function pinchZoomTouchEvent(stage) {
  if (stage) {
    stage.getContent().addEventListener('touchmove', (evt) => {
      const t1 = evt.touches[0];
      const t2 = evt.touches[1];

      if (t1 && t2) {
        evt.preventDefault();
        evt.stopPropagation();
        const oldScale = stage.scaleX();

        const dist = getDistance(
          { x: t1.clientX, y: t1.clientY },
          { x: t2.clientX, y: t2.clientY }
        );
        if (!lastDist) lastDist = dist;
        const delta = dist - lastDist;

        const px = (t1.clientX + t2.clientX) / 2;
        const py = (t1.clientY + t2.clientY) / 2;
        const pointer = point || clientPointerRelativeToStage(px, py, stage);
        if (!point) point = pointer;

        const startPos = {
          x: pointer.x / oldScale - stage.x() / oldScale,
          y: pointer.y / oldScale - stage.y() / oldScale,
        };

        const scaleBy = 1.01 + Math.abs(delta) / 100;
        const newScale = delta < 0 ? oldScale / scaleBy : oldScale * scaleBy;
        stage.scale({ x: newScale, y: newScale });

        const newPosition = {
          x: (pointer.x / newScale - startPos.x) * newScale,
          y: (pointer.y / newScale - startPos.y) * newScale,
        };

        stage.position(newPosition);
        stage.batchDraw();
        lastDist = dist;
      }
    }, false);

    stage.getContent().addEventListener('touchend', () => {
      lastDist = 0;
      point = undefined;
    }, false);
  }
}

