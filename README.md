# Color Shift
### [live](http://peterfonseca.gq/color-shift)

![screenshot][screenshot]

Color shift is a vanilla JavaScript canvas game where the player must absorb shapes of the same color (changing colors on each absorption). It is built around a custom 2d physics engine that support simultaneous collisions by keeping track of all forces acting on an entity and applying them at the end of each frame. Overlaps are handled by adding slight nudges to these forces.

```JavaScript
// if both cirlces moving towards each other (avoid sticking)
if (Util.dotProduct(velocityDiff, dispDiff) < 0) {
  this.alreadyCollided.push(other);
  other.alreadyCollided.push(this);

  let newReflectiveForce = [];
  newReflectiveForce[0] = ( this.velocity[0] *
    (this.mass - other.mass) +
    (2 * other.mass * other.velocity[0])
  ) / (this.mass + other.mass);

 ...

 this.reflectiveForce[0] += (newReflectiveForce[0]) * inelasticLoss;
}
```

> Task switching, or set-shifting, is an executive function and a kind of cognitive flexibility that involves the ability to shift attention between one task and another. This ability allows a person to rapidly and efficiently adapt to different situations.

> -wikipedia

I chose to theme around an underlying concept of [set-shifting](http://www.nature.com/neuro/journal/v1/n1/abs/nn0598_80.html) in order to capture it's naturally challenging effect. To be more specific, color-shift introduces a visuospatially straining shift (change in color) to an already distracting environment. Despite the other factors at play, users almost always experience a few "bounces" into shapes of the wrong color (usually the previous player-color) at first, but get used to the specific kind of shift and begin to expect a change before it occurs. This conditioning to "the shift" is very much in agreement with neurological observations.

[screenshot]: docs/color-shift-screenshot.png "screenshot"
