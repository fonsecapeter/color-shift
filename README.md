# Color Shift
### [live](http://peterfonseca.gq/color-shift)

![screenshot][screenshot]

Color shift is a vanilla JavaScript canvas game where the player must absorb shapes of the same color (changing colors on each absorption). It is built around a custom 2d physics engine that supports simultaneous inelastic collision simulation. The player is subject to drag so that it's velocity doesn't get too crazy, but the other shapes face no resistance to preserve some of the energy in the universe.

```javascript
// if both circles are moving towards each other (avoids sticking)
if (Util.dotProduct(velocityDiff, dispDiff) < 0) {
  const thisMass = Math.pow(this.radius, 3);
  const otherMass = Math.pow(other.radius, 3);

  let newReflectiveForce = [];
  newReflectiveForce[0] = (
    (thisMass - otherMass) +
    (2 * otherMass * other.velocity[0])
  ) / (thisMass + otherMass);

  ...

  this.reflectiveForce[0] *= (newReflectiveForce[0]) * inelasticLoss;

  ...
```
> Task switching, or set-shifting, is an executive function and a kind of cognitive flexibility that involves the ability to shift attention between one task and another. This ability allows a person to rapidly and efficiently adapt to different situations.
-wikipedia

I chose to theme around an underlying concept of [set-shifting](http://www.nature.com/neuro/journal/v1/n1/abs/nn0598_80.html) in order to capture it's naturally challenging effect. To be more specific, color-shift introduces a visuospatially straining shift (change in color) to an already distracting environment. Despite the other factors at play, users almost always experience a few "bounces" into shapes of the wrong color (usually the previous player-color) at first, but get used to the specific kind of shift and begin to expect a change before it occurs. This conditioning to "the shift" is very much in agreement with neurological observations.

[screenshot]: docs/color-shift-screenshot.png "screenshot"
