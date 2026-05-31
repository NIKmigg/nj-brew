<template>
  <section class="story relative h-[400vh]">
    <div class="sticky top-0 h-screen">
      <TresCanvas
        window-size
        clear-color="#00000000"
        :gl="{
          alpha: true,
          antialias: true,
        }"
      >
        <TresPerspectiveCamera
          :position="[7, 7, 7]"
          :look-at="[0, 0, 0]"
        />

        <TresAmbientLight :intensity="0.8" />

        <TresDirectionalLight
          :position="[5, 5, 5]"
          :intensity="1"
        />
        <TresBoxHelper />
        <OrbitControls />

        <primitive
          v-if="model"
          :object="model.scene"
        />
      </TresCanvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const { state: model } = useGLTF("/bottle2.glb");

onMounted(() => {
  watch(
    model,
    (gltf) => {
      if (!gltf) {
        return;
      }

      const bottle = gltf.scene;

      gsap.timeline({
        scrollTrigger: {
          trigger: ".story",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      })
        .to(bottle.rotation, {
          y: Math.PI * 2,
        })
        .to(
          bottle.position,
          {
            x: 2,
            y: -2,
          },
          0,
        )
        .to(
          bottle.rotation,
          {
            z: Math.PI / 4,
          },
          0.5,
        )
        .to(bottle.position, {
          motionPath: {
            path: [
              { x: 0, y: 0, z: 0 },
              { x: 1, y: -1, z: 0 },
              { x: 3, y: -4, z: 1 },
              { x: 0, y: -8, z: 2 },
            ],
          },
        })
        .to(
          bottle.position,
          {
            x: 4,
            y: -6,
          },
          1,
        );
    },
    {
      immediate: true,
    },
  );
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>
